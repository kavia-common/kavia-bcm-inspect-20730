import withMenu from "pages/capability/withmenu";
import SubDomainCard from "./card-sub-domain";
import { DEFAULT_CONFIG } from "config/defaultConfig";

export default (props: any) => {
  let SubDomainCardWithMenu;

  if (props.isEditable) {
    SubDomainCardWithMenu = withMenu(
      // Wrap SubDomainCard in a Box to always render something for menu anchor
      (innerProps: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <SubDomainCard {...innerProps} hideName={innerProps.hideName} />
        </div>
      ),
      "subdomain",
      props.iconColor || "#1F2937", // use passed color or fallback
      `${DEFAULT_CONFIG.server.rest.baseURL}subdomain/${props.id}`,
      `${DEFAULT_CONFIG.server.rest.baseURL}subdomain/${props.id}`,
      props.onSave
    );
  } else {
    SubDomainCardWithMenu = SubDomainCard;
  }

  // Always render, hideName is passed from parent
  return <SubDomainCardWithMenu {...props} hideName />;
};