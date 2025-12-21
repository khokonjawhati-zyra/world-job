export class SubscriptionPlan {
  id: string;
  name: string;
  role: 'worker' | 'employer';
  price: number;
  description: string;
  features: string[];

  constructor(
    id: string,
    name: string,
    role: 'worker' | 'employer',
    price: number,
    description: string,
    features: string[],
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.price = price;
    this.description = description;
    this.features = features;
  }
}

export class AdCampaign {
  id: string;
  brand: string;
  title: string;
  imageUrl: string;
  targetRole: 'worker' | 'employer' | 'all';

  constructor(
    id: string,
    brand: string,
    title: string,
    imageUrl: string,
    targetRole: 'worker' | 'employer' | 'all',
  ) {
    this.id = id;
    this.brand = brand;
    this.title = title;
    this.imageUrl = imageUrl;
    this.targetRole = targetRole;
  }
}
