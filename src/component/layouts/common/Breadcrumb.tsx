import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
