import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

interface CardItemProps {
  id: string;
  title: string;
  image?: string;
  description?: string;
  onChange: (value: string, field: "title" | "image" | "description") => void;
  onRemove: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  id,
  title,
  image = "",
  description = "",
  onChange,
  onRemove,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedDescription, setEditedDescription] = useState(description);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setEditing(false);
    try {
      await axios.put(`http://localhost:8080/card/update/${id}`, {
        title: editedTitle,
        image: editedImage,
        description: editedDescription,
      });
      onChange(editedTitle, "title");
      onChange(editedDescription, "description");
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };
  
  const handleCancel = () => {
    setEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEditedImage(files[0]);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/card/deleteById/${id}`);
      onRemove();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <Card variant="outlined" style={{ marginBottom: "8px", width: "22rem" }}>
      <CardContent>
        {editing ? (
          <>
            <TextField
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              fullWidth
              required
              style={{ marginBottom: "8px" }}
            />
            <Button
              variant="outlined"
              component="label"
              htmlFor="image-upload"
              style={{ marginBottom: "8px" }}
            >
              Choose Image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Button>
            <TextField
              label="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              style={{ marginBottom: "8px" }}
            />
          </>
        ) : (
          <>
            {image && (
              <img
                src={image}
                alt="Image"
                style={{ maxWidth: "100%", marginBottom: "8px" }}
              />
            )}
            <Typography gutterBottom variant="h5" component="div">
              {editedTitle}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        {editing ? (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!editedTitle}
              sx={{ marginRight: "8px" }}
            >
              Save
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <EditIcon onClick={handleEdit} />
            <DeleteIcon onClick={handleDelete} color="error" />
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default CardItem;
