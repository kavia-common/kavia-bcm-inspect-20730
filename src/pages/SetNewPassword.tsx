// SetNewPassword.tsx
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Reuse the styled components from SignIn.tsx
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
    background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 45px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  &:hover,
  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  }
`;

interface LocationState {
  session: string;
  challengeName: string;
  email: string;
}

const SetNewPassword: React.FC = () => {
  const { completeNewPasswordChallenge } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);

  const { session, email } = location.state as LocationState;

  const onFinish = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await completeNewPasswordChallenge({
        session,
        email,
        newPassword: values.newPassword,
      });

      message.success("Password successfully set!");
      navigate("/");
    } catch (error) {
      message.error("Failed to set new password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard title="Set New Password">
        <Form
          name="setNewPassword"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
              },
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#4299e1" }} />}
              placeholder="Enter your new password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#4299e1" }} />}
              placeholder="Confirm your new password"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Set New Password
            </StyledButton>
          </Form.Item>
        </Form>
      </StyledCard>
    </Container>
  );
};

export default SetNewPassword;
