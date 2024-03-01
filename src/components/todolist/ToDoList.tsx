import { Box, Button, Container, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import CardItem from "../task-card/Card";

interface CardData {
  id: string;
  title: string;
  image?: string;
  description?: string;
}

interface ToDoListProps {
  boardId: string;
  boardName: string;
  boardData: any;
}

const ToDoList: React.FC<ToDoListProps> = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [newCardTitle, setNewCardTitle] = useState<string>("");

  const createCardMutation = useMutation<CardData, unknown, { title: string }>(
    (newCardData) =>
      axios.post(`http://localhost:8080/card/save`, newCardData, {
        withCredentials: true,
      })
  );

  const handleAddCard = async () => {
    try {
      const response = await createCardMutation.mutateAsync({
        title: newCardTitle,
      });
      setCards((prevCards) => [...prevCards, response]);
      setNewCardTitle("");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleEditCard = (
    index: number,
    newValue: string,
    field: keyof CardData
  ) => {
    const newCards = [...cards];
    newCards[index][field] = newValue;
    setCards(newCards);
  };

  const handleDeleteCard = async (index: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/card/delete/${cards[index].id}`
      );
      const newCards = [...cards];
      newCards.splice(index, 1);
      setCards(newCards);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ marginBottom: "16px", display: "flex" }}>
        <TextField
          label="New Card Title"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAddCard}
          size="small"
          style={{ marginLeft: "10px", width: "200px" }}
          disabled={createCardMutation.isLoading}
        >
          {createCardMutation.isLoading ? "Adding..." : "Add Card"}
        </Button>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {cards.map((card, index) => (
          <CardItem
            key={index}
            id={card.id}
            title={card.title}
            image={card.image}
            description={card.description}
            onChange={(value: string, field: keyof CardData) =>
              handleEditCard(index, value, field)
            }
            onRemove={() => handleDeleteCard(index)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ToDoList;
