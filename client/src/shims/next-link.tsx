import React from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Link({ href, children, ...props }: any) {
  // Map Next.js href to React Router's 'to' prop
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
