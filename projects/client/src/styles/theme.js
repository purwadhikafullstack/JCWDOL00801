import { extendTheme } from "@chakra-ui/react";
import { inputTheme } from "./input";
import { selectTheme } from "./select";
import { StepsTheme as Steps } from "chakra-ui-steps";

export const theme = extendTheme({
  components: { Input: inputTheme, Select: selectTheme, Steps },
});
