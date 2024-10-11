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
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { Dashboard, FormatListBulleted } from "@mui/icons-material";
import CopyToClipboard from "../components/CopyToClipboard";
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

  const [textToTranslate, setTextToTranslate] = useState("");
  const [listMode, setListMode] = useState(
    parseInt(localStorage.getItem("babble_listMode")) || 0
  );
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const buildOpenaiJsonRequest = async () => {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: import.meta.env.MODE === "development",
    });

    try {
      setLoading(true);
      const results = await Promise.all(
        selectedCountries.map(async (c) => {
          const prompt = `Please translate the following message into ${c.language[0].name}: ${textToTranslate}`;
          const messages = [{ role: "user", content: prompt }];
          const response = await openai.chat.completions.create({
            model: OPENAI_API_MODEL,
            messages,
          });
          return { country: c.country, language: c.language[0].name, response };
        })
      );

      const simpleResults = results.map((result) => {
        result.status = "success";
        result.response = result.response.choices[0].message.content;
        return result;
      });
      // loop over the selectedCountries array and add translatedText using country
      const selectedCountriesWithTranslatedText = [...selectedCountries].map(
        (c, index) => {
          const foundCountry = simpleResults.find(
            (entry) => entry.country === c.country
          );
          c.translatedText = foundCountry.response;
          return c;
        }
      );
      setSelectedCountries(selectedCountriesWithTranslatedText);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getGoogleTranslation = async () => {
    try {
      setLoading(true);
      const results = await Promise.all(
        selectedCountries.map(async (country) => {
          const queryParams = {
            source: "en",
            target: country.language[0].language_abbreviation,
            format: "text",
            q: textToTranslate,
            key: GOOGLE_API_KEY,
          };
          const queryString = new URLSearchParams(queryParams).toString();
          const response = await fetch(`${GOOGLE_API_LINK}?${queryString}`, {
            method: "POST",
          }).then((response) => response.json());
          return {
            country: country.country,
            language: country.language[0].name,
            response,
          };
        })
      );
      console.log(results);
      const selectedCountriesWithTranslatedText = [...selectedCountries].map(
        (c, index) => {
          const foundCountry = results.find(
            (entry) => entry.country === c.country
          );
          if (foundCountry.response?.error) {
            c.status = "error";
            c.translatedText = foundCountry.response?.error?.message;
          } else {
            c.status = "success";
            c.translatedText =
              foundCountry.response?.data.translations[0].translatedText;
          }
          return c;
        }
      );
      setSelectedCountries(selectedCountriesWithTranslatedText);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleListModeChange = (mode) => {
    localStorage.setItem("babble_listMode", mode);
    setListMode(mode);
  };

  const toggleSelect = () => {
    if (selectedCountries.length === 0) {
      setSelectedCountries(natoCountries);
    } else {
      setSelectedCountries([]);
    }
  };

  const copyAll = () => {
    const text = selectedCountries
      .filter(({ status }) => status === "success")
      .map(
        ({ country, language, translatedText }) =>
          `${country} • ${language[0]?.name}\n${translatedText}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const isMd = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const CountrySelect = () => (
    <>
      <Stack
        direction="row"
        spacing={1}
        px={2}
        py={1}
        justifyContent="space-between"
        alignItems="center"
      >
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
        <Typography>Country Select</Typography>
        <Button onClick={toggleSelect} size="small">
          {selectedCountries.length === 0
            ? "Select All"
            : `Deselect All (${selectedCountries.length})`}
        </Button>
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
          sx={{
            maxWidth: { xs: "100vw", md: "75vw" },
            maxHeight: "calc(100dvh - 6rem)",
            overflowY: "auto",
          }}
        >
          <CountryCardGrids
            selectedCountries={selectedCountries}
            onSelect={handleCountrySelect}
          />
        </Stack>
      )}
    </>
  );

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={1}
        direction={{ xs: "column-reverse", lg: "row" }}
      >
        {isMd ? (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            anchor="right"
          >
            <CountrySelect />
            <Stack direction="row" spacing={1} p={2} justifyContent="center">
              <Button onClick={() => setDrawerOpen(false)} variant="contained">
                Close
              </Button>
            </Stack>
          </Drawer>
        ) : (
          <Grid size={{ xs: 12, lg: 6 }} component={Paper} px={1} pb={1}>
            <CountrySelect />
          </Grid>
        )}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ p: 2 }} component={Paper}>
          <Stack direction="row" spacing={1} justifyContent="space-bewteen">
            <Typography
              variant="h6"
              fontWeight="bold"
              letterSpacing={1}
              flex={1}
            >
              Welcome To NATO Country Babble!
            </Typography>
            {isMd && (
              <Button
                size="small"
                variant="contained"
                onClick={() => setDrawerOpen(true)}
              >
                Select Countries
              </Button>
            )}
          </Stack>
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
              disabled={selectedCountries.length === 0 || loading}
              fullWidth
            >
              Open AI
            </Button>
            <Button
              variant="contained"
              onClick={getGoogleTranslation}
              disabled={selectedCountries.length === 0 || loading}
              fullWidth
            >
              Google
            </Button>
            <CopyToClipboard
              onClick={() => copyAll()}
              size="medium"
              variant="contained"
              label="Copy All"
              disabled={
                loading ||
                selectedCountries.length === 0 ||
                !selectedCountries.some((c) => !!c.translatedText)
              }
              sx={{ fullWidth: true, whiteSpace: "nowrap", px: 4 }}
            />
          </Stack>
          <TranslatedOutput
            selectedCountries={selectedCountries}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
