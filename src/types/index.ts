export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  thumbnail: string;
  createdAt: string;
}

export interface PromoConfig {
  text: string;
  isActive: boolean;
}

export interface AdminConfig {
  route: string;
  username: string;
  password: string;
}
export interface GalleryItem {
  id: string;
  image: string;
  description: string;
  createdAt: string;
}