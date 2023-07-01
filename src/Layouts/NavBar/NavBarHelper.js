import {styled} from "@mui/material";
import { DateTime } from "luxon";
import { getStateData } from "../../auth/Auth";
import MuiAppBar from '@mui/material/AppBar';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
export const drawerWidth = 240;




export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



export const DetermineDaytimeOrEvening = () => {

    const { user, buisness} = getStateData();
    if (!user || !buisness) { return null;}
    const timezone = buisness.timezone;
    if (!timezone) { return 'No timezone present.';}


    const currentTime = DateTime.local().setZone(timezone);
  
    const morningThreshold = DateTime.local().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    const eveningThreshold = DateTime.local().set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
  
    if (currentTime < morningThreshold) {
      return <WbTwilightIcon />;
    } else if (currentTime >= eveningThreshold) {
      return <BedtimeIcon />
    } else {
      return <WbSunnyIcon/>;
    }
  };