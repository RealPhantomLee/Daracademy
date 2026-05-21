import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

export interface WelcomeEmailProps {
  userEmail?: string;
  userName?: string;
  dashboardUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://daracademy.com";

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userEmail = "user@example.com",
  userName = "User",
  dashboardUrl = `${baseUrl}/dashboard`,
}) => (
  <Html>
    <Head />
    <Preview>Welcome to Daracademy</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Welcome to Daracademy</Text>
          <Hr style={hr} />
          <Text style={paragraph}>Hi {userName},</Text>
          <Text style={paragraph}>
            We're excited to have you join Daracademy. Whether you're here to
            learn, tutor, or guide a student, you're in the right place.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Get Started
            </Button>
          </Section>
          <Text style={paragraph}>
            If you have any questions or need help, don't hesitate to reach out
            to our support team.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 2024 Daracademy. All rights reserved.</Text>
          <Text style={footer}>
            This email was sent to {userEmail}. If you don't want to receive
            these emails, you can unsubscribe.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const heading = {
  color: "#0f172a",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
