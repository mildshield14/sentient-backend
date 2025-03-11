from mood import get_face_landmarks
import os
import cv2

data_dir = 'train'
if not os.path.exists(data_dir):
    raise FileNotFoundError(f"The directory {data_dir} does not exist.")
else:
    print("Folder found")

for emotion in os.listdir(data_dir):
    for image_path_ in os.listdir(os.path.join(data_dir, emotion)):
        image_path = os.path.join(data_dir, emotion, image_path_)

        image = cv2.imread(image_path)

        face_landmarks = get_face_landmarks(image)