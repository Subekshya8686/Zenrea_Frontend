import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Profile from "../Profile";
import Board from "../board/Board"; // Import Board component
import axios from "axios";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function SideNavbarWithTabs() {
  const [value, setValue] = React.useState(0);
  const [boardData, setBoardData] = React.useState<any[]>([]);
  const [userData, setUserData] = React.useState({
    username: "",
    email: "",
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("http://localhost:8080/board");
        setBoardData(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handler for creating a new board tab
  const handleCreateBoardTab = (boardName: string) => {
    setBoardData(prevBoards => [...prevBoards, { id: Math.random().toString(), boardName }]);
    setValue(boardData.length + 2); // Switch to the newly created board tab
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider", minWidth: "150px" }}
      >
        <Tab label="Profile" {...a11yProps(0)} sx={{ m: 2 }} />
        <Tab label="Boards" {...a11yProps(1)} sx={{ m: 2 }} />
        {boardData.map((board: any, index: number) => (
          <Tab
            key={index + 2}
            label={board.boardName}
            {...a11yProps(index + 2)}
            sx={{ m: 2 }}
          />
        ))}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Profile username={userData.username} email={userData.email} onCreateBoardTab={handleCreateBoardTab} />
      </TabPanel>
      {boardData.map((board: any, index: number) => (
        <TabPanel key={index + 2} value={value} index={index + 2}>
          <Board id={board.id} boardName={board.boardName} />
        </TabPanel>
      ))}
    </Box>
  );
}
