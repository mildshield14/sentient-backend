# Starting by cleaning datset by deleting pictures not matching emotion
import cv2
import mediapipe as mp

def get_face_landmarks(image, draw=False):

    # read input image

    face_mesh = mp.solutions.face_mesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)

    image_rows, image_cols, _ = image.shape
    results = face_mesh.process(image)

    image_landmarks = []

    if results.multi_face_landmarks:
        if draw:
            mp_drawing = mp.solutions.drawing_utils
            mp_drawing_styles = mp.solutions.drawing_styles
            drawing_specs = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

            mp_drawing.draw_landmarks(
                image = image,
                landmark_list=results.multi_face_landmarks[0],
                connections=mp.solutions.face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=drawing_specs,
                connextion_drawing_spec=drawing_specs)

        ls_single_face = results.multi_face_landmarks[0].landmark
        xs_ = []
        ys_ = []
        zs_ =[]

        for idx in ls_single_face:
            xs_.append(idx.x)
            ys_.append(idx.y)
            zs_.append(idx.z)
        for j in range(len(xs_)):
            image_landmarks.append(xs_[j] - min(xs_))
            image_landmarks.append(ys_[j] - min(ys_))
            image_landmarks.append(zs_[j] - min(zs_))

    return image_landmarks