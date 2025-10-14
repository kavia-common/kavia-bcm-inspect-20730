import DomainCard from "./card-domain";
import withMenu from "../capability/withmenu";
import { DEFAULT_CONFIG } from "config/defaultConfig";

export default (props: any) => {
  let DomainCardWithMenu;

  if (props.isEditable) {
    DomainCardWithMenu = withMenu(
      DomainCard,
      "domain", // ✅ consistent lowercase type
      props.iconColor || "#1F2937", // ✅ use passed icon color or fallback
      `${DEFAULT_CONFIG.server.rest.baseURL}domain/${props.id}`,
      `${DEFAULT_CONFIG.server.rest.baseURL}domain/${props.id}`,
      props.onSave
    );
  } else {
    DomainCardWithMenu = DomainCard;
  }

  // ✅ Forward capabilityColor so Domain can derive faded tones
  // ✅ Add hideName for consistent styling if needed
  return (
    <DomainCardWithMenu
      {...props}
      hideName
      capabilityColor={props.capabilityColor}
    />
  );
};