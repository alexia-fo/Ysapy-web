//para nabvar 
export interface MenuItem {
    title: string;
    route: string;
    isDropdown: boolean;
    dropdownItems?: MenuItem[];
}
  