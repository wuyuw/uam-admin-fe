import { PRIMARY_COLOR } from '@/constants';
import { orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { FC, PropsWithChildren } from 'react';

// mui定制主题
// https://mui.com/zh/material-ui/customization/theming/

// 自定义变量
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// 自定义调色板颜色
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  // 自定义变量
  status: {
    danger: orange[500],
  },
  palette: {
    primary: {
      // light: 这将从 palette.primary.main 中进行计算，
      main: PRIMARY_COLOR,
      // dark: 这将从 palette.primary.main 中进行计算，
      // contrastText: 这将计算与 palette.primary.main 的对比度
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: 这将从 palette.secondary.main 中进行计算，
      contrastText: '#ffcc00',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    // 使用 `getContrastText()` 来最大化
    // 背景和文本的对比度
    // contrastThreshold: 3,

    // 使用下面的函数用于将颜色的亮度在其调色板中
    // 移动大约两个指数。
    // 例如，从红色 500（Red 500）切换到 红色 300（Red 300）或 红色 700（Red 700）。
    // tonalOffset: 0.2,
  },
});

const MuiTheme: FC<PropsWithChildren> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiTheme;
