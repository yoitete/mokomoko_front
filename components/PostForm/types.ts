export type PostFormData = {
  title: string;
  description: string;
  price?: number;
  tags: string[];
  images: File[];
  material?: string[];
  sleeping_position?: string[];
  height?: string[];
  order_type?: string;
};

export type PostFormSectionProps = {
  data: PostFormData;
  onChange: <K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K]
  ) => void;
  onImageChange?: (files: File[]) => void;
  previewUrls?: string[];
  showImageUpload?: boolean;
};
