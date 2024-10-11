import { useState } from "react";
import {
  Container,
  Grid2 as Grid,
  TextField,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  Stack,
} from "@mui/material";
import { Dashboard, FormatListBulleted } from "@mui/icons-material";
import natoCountries from "../assets/countries.json";
import languageInfo from "../assets/languages.json";
import CountryCardGrids from "../components/CountryCardGrids";
import CountryList from "../components/CountryList";
import TranslatedOutput from "../components/TranslatedOutput";
import OpenAI from "openai";

function HomePage() {
  const OPENAI_API_LINK = import.meta.env.VITE_OPENAI_API_LINK;
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const OPENAI_API_MODEL = import.meta.env.VITE_OPENAI_API_MODEL;

  const GOOGLE_API_LINK = import.meta.env.VITE_GOOGLE_API_LINK;
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const [textToTranslate, setTextToTranslate] = useState(
    "Hello! My name is john smith. Nice to meet you."
  );
  const [listMode, setListMode] = useState(
    parseInt(localStorage.getItem("babble_listMode")) || 0
  );
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleCountrySelect = (index) => {
    const foundCountry = natoCountries[index];
    const alreadySelected =
      selectedCountries.findIndex(
        (entry) => entry.country === foundCountry.country
      ) > -1;

    let tempList = [...selectedCountries];
    if (alreadySelected) {
      tempList = tempList.filter(
        (entry) => entry.country !== foundCountry.country
      );
    } else {
      tempList.push(foundCountry);
    }
    setSelectedCountries(tempList);
  };
  // Structures JSON for HTTP post Request to OpenAI
  const buildOpenaiJsonRequest = async () => {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: import.meta.env.MODE === "development",
    });

    try {
      const results = await Promise.all(
        selectedCountries.map((country) => {
          const prompt = `Please translate the following message into ${country.language[0].name}: ${textToTranslate}`;
          const messages = [{ role: "user", content: prompt }];

          return openai.chat.completions.create({
            model: OPENAI_API_MODEL,
            messages,
          });
        })
      );

      // for now, I'll just print the response. Later, I'll return it to an array in a builder function.
      console.log(results);
      // setTranslatedText(aiResponse);
    } catch (e) {
      console.error(e);
    }
  };

  const getGoogleTranslation = async () => {
    // provide language and
    // TODO -- access language abbreviation of selected language
    try {
      const results = await Promise.all(
        selectedCountries.map((country) => {
          const myBody = {
            source: "en",
            target: country.language[0].name,
            q: textToTranslate,
            mimeType: "text/plain",
          };
          return fetch(GOOGLE_API_LINK, {
            method: "POST",
            body: myBody,
            headers: {
              key: GOOGLE_API_KEY,
            },
          });
        })
      );

      console.log(results);
      // setTranslatedText(jsonResponse);
    } catch (e) {
      console.error(e);
    }
  };

  // const getDeeplTranslation = async () => {
  //   // TODO -- Map selected language to language code

  //   const myBody = {"text":[textToTranslate],"target_lang":languageInfo[]};
  //   const response = await fetch("https://translate.googleapis.com/v3beta1/", {
  //     method: "POST",
  //     body: myBody,
  //     headers: { "Host": DEEPL_API_LINK,
  //       "Authorization": "DeepL-Auth-Key [yourAuthKey]",
  //       "User-Agent": "YourApp/1.2.3",
  //       "Content-Length": 45,
  //       "Content-Type": "application/json" },
  //   });
  //   const jsonResponse = response.json;
  //   translatedText = jsonResponse["translations"][0]["text"];
  //   console.log(translatedText);
  // };

  const handleListModeChange = (mode) => {
    localStorage.setItem("babble_listMode", mode);
    setListMode(mode);
  };

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={1}
        direction={{ xs: "column-reverse", lg: "row" }}
      >
        <Grid size={{ xs: 12, lg: 6 }} component={Paper} px={1} pb={1}>
          <Stack direction="row" spacing={1} px={2} py={1}>
            <ButtonGroup variant="contained">
              <Button
                onClick={() => handleListModeChange(0)}
                size="small"
                color={listMode === 0 ? "primary" : "inherit"}
              >
                <FormatListBulleted />
              </Button>
              <Button
                onClick={() => handleListModeChange(1)}
                size="small"
                color={listMode === 1 ? "primary" : "inherit"}
              >
                <Dashboard />
              </Button>
            </ButtonGroup>
          </Stack>
          {listMode === 0 && (
            <CountryList
              selectedCountries={selectedCountries}
              onSelect={handleCountrySelect}
            />
          )}
          {listMode === 1 && (
            <Stack
              direction="row"
              flexWrap="wrap"
              p={0.5}
              justifyContent="center"
              gap={1}
              sx={{ maxHeight: "calc(100dvh - 6rem)", overflowY: "auto" }}
            >
              <CountryCardGrids
                selectedCountries={selectedCountries}
                onSelect={handleCountrySelect}
              />
            </Stack>
          )}
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ p: 2 }} component={Paper}>
          <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
            Welcome To Babble!
          </Typography>
          <TextField
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
            label="Enter Text To Translate"
            variant="filled"
            sx={{ mt: 1 }}
            autoComplete="off"
            fullWidth
            multiline
            autoFocus
            minRows={2}
            maxRows={4}
          />
          <Stack direction="row" spacing={1} py={1} px={2}>
            <Button
              variant="contained"
              onClick={buildOpenaiJsonRequest}
              fullWidth
            >
              Translate w/ GPT
            </Button>
            <Button
              variant="contained"
              onClick={getGoogleTranslation}
              fullWidth
            >
              Translate w/ Google
            </Button>
          </Stack>
          <TranslatedOutput selectedCountries={selectedCountries} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
