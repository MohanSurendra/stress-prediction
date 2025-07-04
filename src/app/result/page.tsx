"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  Stack,
  Divider,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { FaRegLightbulb } from "react-icons/fa";

// Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: "#592E83",
      light: "#9984D4",
      dark: "#230C33",
    },
    secondary: {
      main: "#CAA8F5",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#230C33",
      secondary: "#592E83",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
});

// Stress types info
const stressTypes = {
  acute: {
    label: "Acute Stress",
    description: "Short-term stress from specific events or situations.",
    recommendations: [
      "Practice deep breathing exercises.",
      "Take short walks regularly.",
      "Break tasks into manageable steps.",
    ],
    color: "#22c55e",
  },
  episodic: {
    label: "Episodic Stress",
    description: "Frequent stress from recurring challenges or pressures.",
    recommendations: [
      "Set a consistent daily routine.",
      "Try mindfulness or journaling.",
      "Seek support from friends or a counselor.",
    ],
    color: "#f97316",
  },
  chronic: {
    label: "Chronic Stress",
    description: "Ongoing, long-term stress from life circumstances.",
    recommendations: [
      "Talk to a mental health professional.",
      "Improve sleep habits and routine.",
      "Incorporate yoga or relaxation into daily life.",
    ],
    color: "#ef4444",
  },
};

const predictionMap: { [key: string]: keyof typeof stressTypes } = {
  "0": "acute",
  "1": "episodic",
  "2": "chronic",
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [stressType, setStressType] = useState<keyof typeof stressTypes>("episodic");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const level = searchParams.get("stress_level");
      const probability = searchParams.get("probability");

      if (!level) throw new Error("Missing stress_level");

      const prediction = parseInt(level);
      if (isNaN(prediction) || !(prediction in predictionMap)) {
        setFetchError(`Invalid stress level: ${level}`);
        return;
      }

      setStressType(predictionMap[String(prediction)]);

      if (probability) {
        try {
          const parsed = JSON.parse(decodeURIComponent(probability));
          console.log("Probability:", parsed);
        } catch (err) {
          console.warn("Failed to parse probability:", err);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);


  const stressInfo = stressTypes[stressType];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress color="primary" />
          <Typography sx={{ mt: 3 }}>Loading your stress results...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, color: theme.palette.primary.dark }}>
            Your Stress Analysis Results
          </Typography>

          {fetchError && (
            <Box sx={{
              p: 2,
              mb: 4,
              bgcolor: alpha("#f87171", 0.1),
              borderLeft: `4px solid #f87171`,
              borderRadius: 2,
            }}>
              <Typography color="error.main">Error: {fetchError}</Typography>
            </Box>
          )}

          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mb: 6,
          }}>
            <Paper sx={{
              flex: 1,
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              background: alpha(theme.palette.primary.light, 0.05),
              textAlign: "center",
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Stress Type
              </Typography>
              <Chip
                label={stressInfo.label}
                sx={{
                  bgcolor: stressInfo.color,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {stressInfo.description}
              </Typography>
            </Paper>

            <Paper sx={{
              flex: 1.2,
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              background: alpha(theme.palette.primary.light, 0.05),
            }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FaRegLightbulb size={20} color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Recommendations
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {stressInfo.recommendations.map((rec, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Box sx={{
                      width: 6, height: 6, borderRadius: "50%",
                      bgcolor: theme.palette.primary.main, mt: 1, mr: 1.5
                    }} />
                    <Typography variant="body1">{rec}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          <Paper sx={{
            p: 3, mb: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            background: alpha(theme.palette.primary.light, 0.05),
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              About Stress Types
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {Object.values(stressTypes).map((type) => (
                <Box key={type.label} sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Chip
                    label={type.label}
                    sx={{ bgcolor: type.color, color: "white", mr: 2, minWidth: 130 }}
                  />
                  <Typography>{type.description}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link href="/predict" passHref>
              <Button variant="contained" size="large">
                Analyze Again
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="outlined" size="large">
                Home
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
