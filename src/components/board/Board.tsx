import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import ToDoList from "../todolist/ToDoList";
import axios from "axios";

interface BoardProps {
  id: string;
  boardName: string;
}

const Board: React.FC<BoardProps> = ({ id, boardName }) => {
  const [boardData, setBoardData] = useState<any>([]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/boards/getById/${id}`
        );
        setBoardData(response.data);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };

    fetchBoardData();
  }, [id]);

  return (
    <Box>
      <ToDoList boardId={id} boardName={boardName} boardData={boardData} />
    </Box>
  );
};

export default Board;
