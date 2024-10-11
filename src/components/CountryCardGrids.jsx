import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import natoCountries from "../assets/countries.json";

const CountryCardGrids = ({ selectedCountries, onSelect }) => {
  return natoCountries.map(({ country, language, flag }, i) => {
    const isSelected =
      selectedCountries.findIndex((entry) => entry.country === country) > -1;
    return (
      <Card
        key={i}
        sx={{
          width: 130,
          "&:hover .flag": { opacity: 0.8 },
          transition: "filter 0.2s ease-in-out",
          filter: isSelected
            ? "drop-shadow(0 0 2px orange) drop-shadow(0 0 6px orange)"
            : "",
        }}
      >
        <CardActionArea onClick={() => onSelect(i)}>
          <CardMedia
            image={flag}
            className="flag"
            sx={{
              height: 50,
              transition: "opacity 0.2s ease-in-out",
              opacity: isSelected ? 1 : 0.4,
            }}
          />
          <CardContent sx={{ p: 0.5 }}>
            <Typography gutterBottom variant="subtitle" component="div">
              {country}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 9,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 130,
              }}
            >
              {language.map(({ name }) => name).join(", ")}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  });
};

export default CountryCardGrids;
