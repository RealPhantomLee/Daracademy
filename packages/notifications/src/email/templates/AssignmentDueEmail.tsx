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

export interface AssignmentDueEmailProps {
  studentName?: string;
  tutorName?: string;
  assignmentTitle?: string;
  dueDate?: string;
  assignmentUrl?: string;
  userEmail?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://daracademy.com";

export const AssignmentDueEmail: React.FC<AssignmentDueEmailProps> = ({
  studentName = "Student",
  tutorName = "Tutor",
  assignmentTitle = "Math Assignment",
  dueDate = "Tomorrow",
  assignmentUrl = `${baseUrl}/assignments`,
  userEmail = "user@example.com",
}) => (
  <Html>
    <Head />
    <Preview>Assignment due reminder</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Assignment Due</Text>
          <Hr style={hr} />
          <Text style={paragraph}>Hi {studentName},</Text>
          <Text style={paragraph}>
            You have an assignment due from your tutor {tutorName}.
          </Text>
          <Section style={detailsBox}>
            <Row style={detailRow}>
              <Text style={detailLabel}>Assignment:</Text>
              <Text style={detailValue}>{assignmentTitle}</Text>
            </Row>
            <Row style={detailRow}>
              <Text style={detailLabel}>Due:</Text>
              <Text style={detailValue}>{dueDate}</Text>
            </Row>
            <Row style={detailRow}>
              <Text style={detailLabel}>From:</Text>
              <Text style={detailValue}>{tutorName}</Text>
            </Row>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={assignmentUrl}>
              View Assignment
            </Button>
          </Section>
          <Text style={paragraph}>
            Make sure to submit your work on time to avoid any delays in
            feedback.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 2024 Daracademy</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AssignmentDueEmail;

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
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
  borderLeft: "4px solid #d4a574",
};

const detailRow = {
  margin: "8px 0",
};

const detailLabel = {
  color: "#78350f",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-block",
  width: "100px",
};

const detailValue = {
  color: "#451a03",
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
