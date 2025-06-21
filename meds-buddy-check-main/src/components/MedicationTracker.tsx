import React, { useState, useRef } from "react";
import { Check, Clock, Camera, Image as ImageIcon, Trash } from "lucide-react";
import { format } from "date-fns";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
  date: string;
  image?: string;
}

const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  const handleAddMedication = () => {
    if (!name || !dosage || !frequency) return;

    const newMedication: Medication = {
      id: Date.now(),
      name,
      dosage,
      frequency,
      taken: false,
      date: today,
      image: imagePreview || undefined,
    };

    setMedications([...medications, newMedication]);
    setName("");
    setDosage("");
    setFrequency("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleMarkTaken = (id: number) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: true } : med))
    );
  };

  const handleDelete = (id: number) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Medication Tracker</h1>

      {/* Add Medication Form */}
      <div className="space-y-4 p-4 border rounded-lg shadow">
        <input
          type="text"
          placeholder="Medication Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dosage"
          className="w-full border p-2 rounded"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Frequency"
          className="w-full border p-2 rounded"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />

        {/* Image Upload */}
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 flex items-center mx-auto"
          >
            <Camera className="w-4 h-4 mr-2" />
            {selectedImage ? "Change Photo" : "Upload Proof Photo"}
          </button>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Proof"
                className="w-32 h-32 object-cover mx-auto rounded border"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAddMedication}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Medication
        </button>
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        {medications.length === 0 ? (
          <p className="text-center text-gray-500">No medications added.</p>
        ) : (
          medications.map((med) => (
            <div
              key={med.id}
              className={`p-4 border rounded-lg flex justify-between items-center ${
                med.taken ? "bg-green-50 border-green-300" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-semibold">{med.name}</h3>
                <p className="text-sm text-gray-600">
                  {med.dosage} - {med.frequency}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(med.date), "PPP")}
                </p>
                {med.image && (
                  <img
                    src={med.image}
                    alt="Proof"
                    className="w-20 h-20 object-cover mt-2 border rounded"
                  />
                )}
              </div>

              <div className="space-x-2 flex items-center">
                {!med.taken && (
                  <button
                    onClick={() => handleMarkTaken(med.id)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Mark Taken
                  </button>
                )}
                <button
                  onClick={() => handleDelete(med.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  <Trash className="w-4 h-4 inline" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;
