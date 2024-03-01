import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  TextField,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";

interface Board {
  id: string;
  boardName: string;
}

interface ProfileProps {
  username: string;
  email: string;
  onCreateBoardTab: (boardName: string) => void; // Adding the callback function
}

const Profile: React.FC<ProfileProps> = ({ username, email, onCreateBoardTab }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState<string>("");
  const [creatingBoard, setCreatingBoard] = useState<boolean>(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("http://localhost:8080/board/all");
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const createBoardMutation = useMutation((newBoardName: string) => {
    return axios.post("http://localhost:8080/board/save", {
      boardName: newBoardName,
    });
  });

  const handleBoardCreation = async () => {
    try {
      const response = await createBoardMutation.mutateAsync(newBoardName);
      const newBoard: Board = {
        id: response.data.id,
        boardName: newBoardName,
      };
      setBoards(prevBoards => [...prevBoards, newBoard]); 
      setNewBoardName(""); 
      setCreatingBoard(false); 
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Profile</Typography>
        <Typography variant="subtitle1">Username: {username}</Typography>
        <Typography variant="subtitle1">Email: {email}</Typography>
      </Box>
      {creatingBoard ? (
        <Box sx={{ p: 2 }}>
          <TextField
            label="Board Name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleBoardCreation}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Create Board
          </Button>
        </Box>
      ) : (
        <Button onClick={() => setCreatingBoard(true)} variant="contained">
          Create Board
        </Button>
      )}
      {boards.map((board) => (
        <Card
          key={board.id}
          sx={{ mt: 2, p: 2, cursor: "pointer" }}
          onClick={() => onCreateBoardTab(board.boardName)} 
        >
          <Typography>{board.boardName}</Typography>
        </Card>
      ))}
    </Container>
  );
};

export default Profile;
