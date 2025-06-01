import React, { useState } from "react";
import { Input, Button, Card, DatePicker, Form } from "antd";
import { toast, Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import agentApi from "../../services-call/utilisateur";

const FormAgent = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      dateEmbauche: values.dateEmbauche.format("YYYY-MM-DD"),
      role: "agent",
    };

    console.log("Données envoyées à l'API :", formData);
    try {
      const response = await agentApi.createAgent(formData);
      console.log("Réponse reçue de l'API :", response.data);
      toast.success("L'agent a été créé avec succès");
      form.resetFields(); // Réinitialise le formulaire
    } catch (err) {
      console.error("Erreur lors de la création de l'agent :", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Échec dans la création de l'agent ");
    }
  };

  return (
    <>
    <Toaster position="top-right" />
     <div className="flex justify-between items-center mb-6">
        <h2 style={{ textAlign: 'center' ,  color: '#05396d'}}>Ajouter un Agent</h2>
      </div>

    <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Veuillez entrer le nom' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Téléphone" name="telephone" rules={[{ required: true, message: 'Veuillez entrer le téléphone' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Matricule" name="matricule" rules={[{ required: true, message: 'Veuillez entrer le matricule' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Veuillez entrer le mot de passe' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="Date d'embauche" name="dateEmbauche" rules={[{ required: true, message: 'Veuillez choisir une date' }]}>
            <DatePicker className="w-full" placeholder="Sélectionner une date" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default FormAgent;
