import { Stack, Paper, Typography } from "@mui/material";

const TranslatedOutput = ({ selectedCountries }) => {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h6">Translated Text</Typography>
      <Stack
        spacing={0.5}
        p={1}
        sx={{ maxHeight: "calc(100dvh - 18rem)", overflowY: "auto" }}
      >
        {selectedCountries.map(({ country, translatedText = {} }) => (
          <Stack
            key={country}
            direction="row"
            component={Paper}
            elevation={4}
            p={1}
          >
            <Typography>{country}</Typography>
            <Stack flex={1}>
              {Object.entries(translatedText).map(([language, text]) => {
                return (
                  <Stack key={language} direction="row">
                    <Typography>{language}:</Typography>
                    <Typography>{text}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TranslatedOutput;
