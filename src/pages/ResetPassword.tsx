// src/pages/ResetPassword.tsx

import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { resetPassword } from "../services/authService";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
  animation: ${fadeIn} 0.6s ease-out;
  background: rgba(255, 255, 255, 0.95);

  .ant-card-head-title {
    font-size: 24px;
    text-align: center;
    color: #2d3748;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 32px;
  color: #2b6cb0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled(Input)`
  height: 45px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  &:hover,
  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
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

interface ResetPasswordFormData {
  email: string;
  verificationCode: string;
  newPassword: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get email from URL parameters
  const emailFromUrl = searchParams.get("email");

  // Set initial form values
  const initialValues = {
    email: emailFromUrl || "",
  };

  const onFinish = async (values: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await resetPassword(
        values.email,
        values.verificationCode,
        values.newPassword
      );
      message.success("Password has been reset successfully");
      navigate("/signin");
    } catch (error) {
      message.error(
        "Failed to reset password. Please verify your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard
        title={
          <LogoContainer>
            <span>🔐 Reset Password</span>
          </LogoContainer>
        }
      >
        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={initialValues}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <StyledInput
              prefix={<MailOutlined style={{ color: "#4299e1" }} />}
              placeholder="Enter your email"
              disabled={!!emailFromUrl} // Disable if email is provided in URL
            />
          </Form.Item>

          <Form.Item
            label="Verification Code"
            name="verificationCode"
            rules={[
              {
                required: true,
                message: "Please input the verification code!",
              },
              { len: 6, message: "Verification code must be 6 characters!" },
            ]}
          >
            <StyledInput
              prefix={<KeyOutlined style={{ color: "#4299e1" }} />}
              placeholder="Enter verification code"
              maxLength={6}
            />
          </Form.Item>

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
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#4299e1" }} />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Reset Password
            </StyledButton>
          </Form.Item>
        </Form>
      </StyledCard>
    </Container>
  );
};

export default ResetPassword;
