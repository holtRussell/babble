import {
  Backdrop,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import CopyToClipboard from "./CopyToClipboard";

const TranslatedOutput = ({ selectedCountries, loading = false }) => {
  return (
    <Stack
      spacing={0.5}
      p={1}
      sx={{
        maxHeight: "calc(100dvh - 15rem)",
        minHeight: "calc(100dvh - 15rem)",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Backdrop open={loading} sx={{ position: "absolute", borderRadius: 3 }}>
        <CircularProgress size={64} thickness={5} />
      </Backdrop>
      {selectedCountries.length > 0 ? (
        selectedCountries.map(
          ({ country, language, translatedText, status }) => (
            <Stack key={country} component={Paper} elevation={4} p={1}>
              <Divider>
                {language[0]?.name !== country
                  ? `${country} • ${language[0]?.name}`
                  : language[0]?.name}
              </Divider>
              <Stack direction="row" spacing={2} alignItems="center">
                {!!translatedText && status === "success" ? (
                  <Typography flex={1}>{translatedText}</Typography>
                ) : !!translatedText && status === "error" ? (
                  <Alert severity={status} sx={{ flex: 1 }}>
                    {translatedText}
                  </Alert>
                ) : (
                  <Typography textAlign="center" flex={1} variant="caption">
                    Loading...
                  </Typography>
                )}
                {!!translatedText && status === "success" && (
                  <CopyToClipboard text={`${country}:\n${translatedText}`} />
                )}
              </Stack>
            </Stack>
          )
        )
      ) : (
        <Alert severity="info" variant="outlined">
          No countries selected
        </Alert>
      )}
    </Stack>
  );
};

export default TranslatedOutput;
