import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

export interface SessionScheduledEmailProps {
  studentName?: string;
  sessionTime?: string;
  sessionUrl?: string;
  userEmail?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://daracademy.com";

export const SessionScheduledEmail: React.FC<SessionScheduledEmailProps> = ({
  studentName = "Student",
  sessionTime = "Soon",
  sessionUrl = `${baseUrl}/dashboard/sessions`,
  userEmail = "user@example.com",
}) => (
  <Html>
    <Head />
    <Preview>Your tutoring session has been scheduled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Session Scheduled!</Text>
          <Hr style={hr} />
          <Text style={paragraph}>Hi {studentName},</Text>
          <Text style={paragraph}>
            Great news! Your tutoring session has been confirmed and scheduled.
          </Text>
          <Section style={detailsBox}>
            <Row style={detailRow}>
              <Text style={detailLabel}>Time:</Text>
              <Text style={detailValue}>{sessionTime}</Text>
            </Row>
            <Row style={detailRow}>
              <Text style={detailLabel}>Status:</Text>
              <Text style={detailValue}>Confirmed</Text>
            </Row>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={sessionUrl}>
              View Session Details
            </Button>
          </Section>
          <Text style={paragraph}>
            If you need to reschedule or have any questions, please contact us
            right away.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 2024 Daracademy</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SessionScheduledEmail;

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

const heading = {
  color: "#0f172a",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
};

const detailsBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};

const detailRow = {
  margin: "8px 0",
};

const detailLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-block",
  width: "100px",
};

const detailValue = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "500",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  backgroundColor: "#d4a574",
  borderRadius: "4px",
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
