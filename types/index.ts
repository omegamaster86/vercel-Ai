export type SidebarItem = {
  title: string;
  description?: string;
  href: string;
};

export type SidebarProps = {
  heading: string;
  subheading: string;
  items: SidebarItem[];
  className?: string;
};