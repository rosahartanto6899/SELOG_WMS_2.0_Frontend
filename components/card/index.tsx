import { Card as AntdCard, CardProps as AntdCardProps } from "antd";

import styles from "./card.module.scss";
import CardContainer from "./card-container";
import CardFormActions from "./card-container-form-action";
import CardDetail from "./card-detail";
import CardFilter from "./card-filter";
import CardInsight from "./card-insight";
import CardInsightDevice from "./card-insight-device";
import CardMenu from "./card-menu";
import CardNotification from "./card-notification";
import CardSummary from "./card-summary";

export interface CardProps extends AntdCardProps {
  noShadow?: boolean;
}

// const defaultProps = {
//   noShadow: false,
// };

const Card = (props: CardProps) => {
  const { noShadow, className } = props;
  const newProps = {
    ...props,
    className: `${styles["sera-card"]} ${noShadow && styles["no-shadow"]} ${className}`,
  };
  return <AntdCard {...newProps} />;
};

// Card.defaultProps = defaultProps;
Card.Menu = CardMenu;
Card.Container = CardContainer;
Card.Notification = CardNotification;
Card.Insight = CardInsight;
Card.Filter = CardFilter;
Card.Summary = CardSummary;
Card.FormActions = CardFormActions;
Card.InsightDevice = CardInsightDevice;
Card.Detail = CardDetail;

export default Card;
