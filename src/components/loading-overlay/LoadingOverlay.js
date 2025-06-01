import { Spin } from "antd";
import styles from "./LoadingOverlay.module.scss";

const LoadingOverLay = () => {
  return (
    <div className={styles.root}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingOverLay;
