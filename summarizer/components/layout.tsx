import type { FC, ReactNode } from 'react';
import { NavProps } from './nav.js';
export interface LayoutProps {
    children?: ReactNode;
    title?: string;
    description?: string;
}
declare const Layout: FC<LayoutProps>;
// export default Layout;
