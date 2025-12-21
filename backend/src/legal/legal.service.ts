import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface TermClause {
    id: string;
    content: string;
    isMandatory: boolean; // if true, cannot be deleted (e.g. indemnity)
    createdAt: Date;
}

@Injectable()
export class LegalService implements OnModuleInit {
    private readonly logger = new Logger(LegalService.name);
    private readonly DATA_FILE = path.join(process.cwd(), 'data', 'legal_terms.json');

    private clauses: TermClause[] = [];
    private currentVersion = 1;

    // Hardcode the absolute indemnity clause
    private readonly INDEMNITY_CLAUSE: TermClause = {
        id: 'mandatory-001',
        content: 'The Admin/Platform is a facilitator only. Users accept all financial and project risks. Admin holds no liability for losses or disputes.',
        isMandatory: true,
        createdAt: new Date('2024-01-01T00:00:00Z')
    };

    onModuleInit() {
        this.loadTerms();
        this.ensureMandatoryClauses();
    }

    private loadTerms() {
        if (fs.existsSync(this.DATA_FILE)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
                this.clauses = data.clauses || [];
                this.currentVersion = data.version || 1;
            } catch (err) {
                this.logger.error('Failed to load legal terms', err);
                this.clauses = [];
            }
        } else {
            this.clauses = [];
        }
    }

    private saveTerms() {
        try {
            const data = {
                version: this.currentVersion,
                clauses: this.clauses
            };
            fs.writeFileSync(this.DATA_FILE, JSON.stringify(data, null, 2));
        } catch (err) {
            this.logger.error('Failed to save legal terms', err);
        }
    }

    private ensureMandatoryClauses() {
        const index = this.clauses.findIndex(c => c.id === this.INDEMNITY_CLAUSE.id);
        if (index === -1) {
            // Add if missing
            this.clauses.unshift(this.INDEMNITY_CLAUSE);
            this.saveTerms();
        } else {
            // Ensure content matches exactly (prevent editing of mandatory via file hacking)
            if (this.clauses[index].content !== this.INDEMNITY_CLAUSE.content) {
                this.clauses[index] = this.INDEMNITY_CLAUSE;
                this.saveTerms();
            }
        }
    }

    getTerms() {
        return {
            version: this.currentVersion,
            clauses: this.clauses
        };
    }

    addClause(content: string) {
        const newClause: TermClause = {
            id: 'clause-' + Date.now(),
            content,
            isMandatory: false,
            createdAt: new Date()
        };
        this.clauses.push(newClause);
        this.currentVersion++;
        this.saveTerms();
        return this.getTerms();
    }

    removeClause(id: string) {
        const clause = this.clauses.find(c => c.id === id);
        if (clause && clause.isMandatory) {
            throw new Error('Cannot remove mandatory clause');
        }
        this.clauses = this.clauses.filter(c => c.id !== id);
        this.currentVersion++;
        this.saveTerms();
        return this.getTerms();
    }

    updateClause(id: string, content: string) {
        const idx = this.clauses.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('Clause not found');
        if (this.clauses[idx].isMandatory) throw new Error('Cannot edit mandatory clause');

        this.clauses[idx].content = content;
        this.currentVersion++;
        this.saveTerms();
        return this.getTerms();
    }
}
