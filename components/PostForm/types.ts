export type PostFormData = {
  title: string;
  description: string;
  price?: number;
  tags: string[];
  image?: File | null;
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
  onImageChange?: (file: File | null) => void;
  previewUrl?: string | null;
  showImageUpload?: boolean;
};
