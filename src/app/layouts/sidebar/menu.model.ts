export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  isCollapsed?: any;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  iconData?:string;
  activeIconData?: string;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
}