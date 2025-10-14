import { SxProps } from "@mui/material";
import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

export interface CustomButtonProps {
  type?: string;
  title: string;
  backgroundColor: string;
  color: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: string;
  style?: object;
  handleClick?: () => void;
  sx?: SxProps;
}

export interface ProfileProps extends Partial<UserProfile> {
  type: string;
  name: string;
  avatar?: string;
  email: string;
}


// export interface PropertyProps {
//   _id: string;
//   title: string;
//   description: string;
//   location: string;
//   price: string;
//   photo: string;
//   creator: string;
// }

export interface FormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void>;
  formLoading: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (file: File) => void;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  propertyImage: { name: string; url: string };
}

export interface MenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  useCustomEditDialog?: boolean; 
  useCustomDeleteDialog?: boolean;
}

export interface MenuItem {
  label: string;
  path: string;
  name: string;
  icon?: ReactNode;
  children?: MenuItem[];
}
