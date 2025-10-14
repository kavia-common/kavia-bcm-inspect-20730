import React, { useState } from "react";
import { Button, Flex } from "antd";
import { DownloadOutlined } from "@mui/icons-material";

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      loading={loadings[0]}
      onClick={() => enterLoading(0)}
    >
      Click me!
    </Button>
  );
};

export default App;
