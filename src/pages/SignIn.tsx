import React, { useState } from "react";
import { Form, Input, Button, Card, message, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { forgotPassword, verifyEmail } from "services/authService";
import logo from "../assets/images/logo-light@2x.png";

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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1F2937 0%, #111827 50%, #1F2937 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 140, 140, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    top: -200px;
    right: -200px;
    animation: pulse 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(163, 230, 53, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    bottom: -150px;
    left: -150px;
    animation: pulse 6s ease-in-out infinite reverse;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.6s ease-out;
  background: #F9FAFB;
  border: 1px solid rgba(229, 231, 235, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;

  .ant-card-body {
    padding: 40px;
  }

  .ant-card-head {
    border-bottom: none;
    padding: 32px 40px 0;
  }

  .ant-card-head-title {
    font-size: 28px;
    text-align: center;
    color: #1F2937;
    font-weight: 700;
  }

  .ant-form-item-label > label {
    color: #1F2937;
    font-weight: 500;
    font-size: 14px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #008C8C 0%, #006B6B 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 140, 140, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 140, 140, 0.4);
    background: linear-gradient(135deg, #007070 0%, #005555 100%) !important;
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 8px;
  animation: ${slideIn} 0.8s ease-out;
`;

const LogoText = styled.div`
  font-size: 36px;
  color: #008C8C;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: #6B7280;
  font-weight: 400;
  margin-top: 8px;
`;

const StyledInput = styled(Input)`
  height: 48px;
  border-radius: 10px;
  border: 2px solid #E5E7EB;
  background: #FFFFFF;
  transition: all 0.3s ease;
  font-size: 15px;

  &:hover {
    border-color: #008C8C;
  }

  &:focus {
    border-color: #008C8C;
    box-shadow: 0 0 0 3px rgba(0, 140, 140, 0.1);
  }

  .ant-input-prefix {
    margin-right: 12px;
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 48px;
  border-radius: 10px;
  border: 2px solid #E5E7EB;
  background: #FFFFFF;
  transition: all 0.3s ease;
  font-size: 15px;

  &:hover {
    border-color: #008C8C;
  }

  &:focus,
  &:focus-within {
    border-color: #008C8C;
    box-shadow: 0 0 0 3px rgba(0, 140, 140, 0.1);
  }

  .ant-input-prefix {
    margin-right: 12px;
  }
`;

const ForgotPasswordLink = styled.a`
  display: inline-block;  
  text-align: right;
  margin-bottom: 24px;
  color: #008C8C;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #006B6B;
    text-decoration: underline;
  }
`;

const ModalButton = styled(Button)`
  border-radius: 10px;
  height: 44px;
  font-weight: 600;
  transition: all 0.3s ease;

  &.ant-btn-default {
    border: 2px solid #E5E7EB;
    color: #1F2937;

    &:hover {
      border-color: #008C8C;
      color: #008C8C;
    }
  }

  &.ant-btn-primary {
    background: linear-gradient(135deg, #008C8C 0%, #006B6B 100%);
    border: none;
    box-shadow: 0 2px 8px rgba(0, 140, 140, 0.3);

    &:hover {
      background: linear-gradient(135deg, #007070 0%, #005555 100%) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 140, 140, 0.4);
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: #F9FAFB;
    border-bottom: 1px solid #E5E7EB;
    padding: 20px 24px;
  }

  .ant-modal-title {
    color: #1F2937;
    font-weight: 600;
    font-size: 18px;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-footer {
    border-top: 1px solid #E5E7EB;
    padding: 16px 24px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #9CA3AF;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #E5E7EB;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const SignIn: React.FC = () => {
  const { signIn } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await signIn(values.email, values.password);

      if (
        response.success === false &&
        response.message === "New password required"
      ) {
        // Navigate to set new password page with session data
        navigate("/set-new-password", {
          state: {
            session: response.session,
            challengeName: response.challengeName,
            email: values.email,
          },
        });
        return;
      }

      message.success("Successfully signed in!");
      navigate("/");
    } catch (error) {
      message.error("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      message.error("Please enter your email address");
      return;
    }

    try {
      setForgotPasswordLoading(true);
      // verify Email
      const checkEmailExist = await verifyEmail(forgotPasswordEmail);
      if (!checkEmailExist.success) {
        message.error("Email not found. Please enter a valid email.");
        return;
      }
      await forgotPassword(forgotPasswordEmail);
      message.success("Verification code has been sent to your email");
      setIsForgotPasswordVisible(false);
      // Navigate to reset password page with email pre-filled
      navigate(
        `/reset-password?email=${encodeURIComponent(forgotPasswordEmail)}`
      );
    } catch (error) {
      message.error("Failed to process forgot password request");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard
        title={
          <LogoContainer>
            <img
              src={logo}
              alt="Biz First"
              style={{
                display: "block",
                margin: "0 auto 8px",
                width: 140,
                height: "auto",
              }}
            />
            <Subtitle>Sign in to continue to your dashboard</Subtitle>
          </LogoContainer>
        }
      >
        <Form
          name="signin"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <StyledInput
              prefix={<UserOutlined style={{ color: "#008C8C", fontSize: "16px" }} />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#008C8C", fontSize: "16px" }} />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <ForgotPasswordLink onClick={() => setIsForgotPasswordVisible(true)}>
            Forgot Password?
          </ForgotPasswordLink>

          <Form.Item style={{ marginBottom: 0 }}>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Sign In
            </StyledButton>
          </Form.Item>
        </Form>

        <StyledModal
          title="Reset Your Password"
          open={isForgotPasswordVisible}
          onCancel={() => {
            setIsForgotPasswordVisible(false);
            setForgotPasswordEmail("");
          }}
          footer={[
            <ModalButton
              key="cancel"
              onClick={() => {
                setIsForgotPasswordVisible(false);
                setForgotPasswordEmail("");
              }}
            >
              Cancel
            </ModalButton>,
            <ModalButton
              key="submit"
              type="primary"
              loading={forgotPasswordLoading}
              onClick={handleForgotPassword}
            >
              Send Reset Code
            </ModalButton>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item
              label="Email Address"
              required
              validateStatus={forgotPasswordEmail ? "success" : "error"}
              help={!forgotPasswordEmail && "Please enter your email address"}
            >
              <StyledInput
                prefix={<MailOutlined style={{ color: "#008C8C", fontSize: "16px" }} />}
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
              />
            </Form.Item>
          </Form>
        </StyledModal>
      </StyledCard>
    </Container>
  );
};

export default SignIn;