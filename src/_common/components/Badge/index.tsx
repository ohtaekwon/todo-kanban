import React from "react";
import * as Styled from "./index.styles";
import { Props } from "./index.types";

const Badge = React.forwardRef(function Badge(
  {
    as = "div",
    role = "",
    className,
    variant = "default",
    width = "auto",
    height = "auto",
    position = "static",
    padding = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    margin = 0,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    backgroundColor = "inherit",
    cursor = "auto",
    children,
    ...rest
  }: React.PropsWithChildren<Props>,
  forwardRef: React.Ref<HTMLElement>
) {
  return (
    <Styled.Badge
      as={as}
      role={role}
      className={className}
      variant={variant}
      width={width}
      height={height}
      position={position}
      padding={padding}
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
      margin={margin}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      backgroundColor={backgroundColor}
      cursor={cursor}
      ref={forwardRef}
      {...rest}
    >
      {children}
    </Styled.Badge>
  );
});
export default Badge;
