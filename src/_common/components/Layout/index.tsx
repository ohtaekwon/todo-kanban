import Header from "components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

import * as Styled from "./index.styles";
import { Props } from "./index.types";

export const Layout = React.forwardRef(function Layout(
  {
    as = "div",
    variant,
    backgroundColor = "inherit",
    backgroundImage = "inherit",
    header,
    children,
    ...rest
  }: React.PropsWithChildren<Props>,
  forwardedRef: React.Ref<HTMLElement>
) {
  return (
    <>
      <Styled.Layout
        className={`layout__${variant}`}
        as={as}
        variant={variant}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        ref={forwardedRef}
        {...rest}
      >
        {header && <Header />}
        {children}
      </Styled.Layout>
    </>
  );
});

export const LayoutElement = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className: string;
}) => {
  return <div>{children}</div>;
};
