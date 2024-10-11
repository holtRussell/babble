import {
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Circle, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import natoCountries from "../assets/countries.json";

const CountryList = ({ selectedCountries, onSelect }) => {
  return (
    <List
      dense
      disablePadding
      sx={{
        display: "flex",
        flexFlow: "column wrap",
        gap: "5px",
        height: 600,
        overflow: "auto",
      }}
    >
      {natoCountries.map((c, index) => {
        const isSelected =
          selectedCountries.findIndex((entry) => entry.country === c.country) >
          -1;
        return (
          <ListItemButton
            key={index}
            onClick={() => onSelect(index)}
            sx={{
              py: 0,
              width: "auto",
              maxHeight: 50,
              borderRadius: 2,
              border: "1px solid #3334",
              backgroundColor: isSelected ? "#1976d280" : "",
              "&:hover": {
                backgroundColor: "#1976d240",
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 30 }}>
              <img src={c.flag} alt={c.country} height={20} width={25} />
            </ListItemAvatar>
            <ListItemText
              primary={c.country}
              secondary={c.language.map(({ name }) => name).join(", ")}
              secondaryTypographyProps={{ fontSize: 10 }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default CountryList;
