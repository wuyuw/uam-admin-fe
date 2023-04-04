import { DefaultFooter } from '@ant-design/pro-components';

interface FooterProps {
  copyright: string;
}

export default (props: FooterProps) => {
  return <DefaultFooter copyright={props.copyright} />;
};
