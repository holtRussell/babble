import { useState } from "react";
import { Button, useMediaQuery, Tooltip } from "@mui/material";
import { ContentCopyTwoTone, Done } from "@mui/icons-material";

const CopyToClipboard = ({
  text,
  onClick,
  disabled,
  size = "small",
  variant = "text",
  label = "Copy to clipboard",
  sx = {},
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const ButtonText = isCopied ? "Copied!" : label;
  const ButtonIcon = isCopied ? <Done /> : <ContentCopyTwoTone />;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <Tooltip title={ButtonText}>
      <span>
        <Button
          onClick={onClick || handleCopy}
          size={size}
          variant={variant}
          sx={{ minWidth: 0, ...sx }}
          disabled={disabled || isCopied}
        >
          {size === "small" || isSmallScreen ? ButtonIcon : ButtonText}
        </Button>
      </span>
    </Tooltip>
  );
};

export default CopyToClipboard;
