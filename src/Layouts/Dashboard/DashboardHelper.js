import { styled } from "@mui/material"
import axios from "axios";
import { getStateData } from "../../auth/Auth";
const BUISNESS_INDEX = 'user';


export const DashboardHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

