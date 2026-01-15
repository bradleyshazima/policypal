import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

// Available variables
const AVAILABLE_VARIABLES = [
  { key: '{client_name}', description: "Client's full name" },
  { key: '{car_model}', description: 'Vehicle make and model' },
  { key: '{renewal_date}', description: 'Policy renewal/expiry date' },
  { key: '{insurance_type}', description: 'Type of insurance cover' },
  { key: '{policy_number}', description: 'Policy number' },
  { key: '{plate_number}', description: 'Vehicle registration number' },
  { key: '{expiry_date}', description: 'Policy expiry date' },
];

export default function MessageTemplatesScreen() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Renewal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTemplates();
    }, [])
  );

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await api.templates.getAll();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Fetch templates error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to load templates',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = async () => {
    if (!templateName.trim() || !templateMessage.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all fields',
      });
      setShowAlert(true);
      return;
    }

    setSaving(true);

    try {
      await api.templates.create({
        name: templateName,
        message: templateMessage,
        category: templateCategory,
      });

      setShowCreateModal(false);
      resetForm();
      fetchTemplates();

      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Template created successfully!',
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Create template error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to create template',
      });
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!templateName.trim() || !templateMessage.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all fields',
      });
      setShowAlert(true);
      return;
    }

    setSaving(true);

    try {
      await api.templates.update(selectedTemplate.id, {
        name: templateName,
        message: templateMessage,
        category: templateCategory,
      });

      setShowEditModal(false);
      setSelectedTemplate(null);
      resetForm();
      fetchTemplates();

      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Template updated successfully!',
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Update template error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to update template',
      });
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await api.templates.delete(id);
      fetchTemplates();

      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Template deleted successfully!',
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Delete template error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to delete template',
      });
      setShowAlert(true);
    }
  };

  const confirmDelete = (template) => {
    setAlertConfig({
      type: 'danger',
      title: 'Delete Template',
      message: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
    });
    setSelectedTemplate(template);
    setShowAlert(true);
  };

  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateMessage(template.message);
    setTemplateCategory(template.category || 'Renewal');
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateMessage('');
    setTemplateCategory('Renewal');
  };

  const insertVariable = (variable) => {
    setTemplateMessage(templateMessage + variable);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Octicons name="search" size={16} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Octicons name="x" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.variablesButton}
          onPress={() => setShowVariablesModal(true)}
        >
          <Octicons name="code" size={16} color={COLORS.blue} />
          <Text style={styles.variablesButtonText}>Variables</Text>
        </TouchableOpacity>
      </View>

      {/* ==================== TEMPLATES LIST ==================== */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredTemplates.length === 0 ? (
          <View style={styles.emptyState}>
            <Octicons name="note" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>No templates found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery ? 'Try a different search term' : 'Create your first message template'}
            </Text>
          </View>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => openEditModal(template)}
              onDelete={() => confirmDelete(template)}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ==================== CREATE BUTTON (FAB) ==================== */}
      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Octicons name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>

      {/* ==================== CREATE/EDIT MODAL ==================== */}
      <Modal
        visible={showCreateModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showEditModal ? 'Edit Template' : 'Create New Template'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                <Octicons name="x" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Template Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Template Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 15-Day Reminder"
                  placeholderTextColor={COLORS.gray}
                  value={templateName}
                  onChangeText={setTemplateName}
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                  {['Renewal', 'Confirmation', 'Welcome', 'Alert'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        templateCategory === cat && styles.categoryChipActive,
                      ]}
                      onPress={() => setTemplateCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          templateCategory === cat && styles.categoryTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Message */}
              <View style={styles.inputGroup}>
                <View style={styles.messageHeader}>
                  <Text style={styles.inputLabel}>Message *</Text>
                  <TouchableOpacity
                    style={styles.insertVariableButton}
                    onPress={() => setShowVariablesModal(true)}
                  >
                    <Octicons name="code" size={14} color={COLORS.blue} />
                    <Text style={styles.insertVariableText}>Insert Variable</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter your message here. Use variables like {client_name}, {renewal_date}, etc."
                  placeholderTextColor={COLORS.gray}
                  value={templateMessage}
                  onChangeText={setTemplateMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {templateMessage.length} characters
                </Text>
              </View>

              {/* Preview */}
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview</Text>
                <View style={styles.previewBox}>
                  <Text style={styles.previewText}>
                    {templateMessage || 'Your message will appear here...'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <Button
                  title={showEditModal ? 'Update Template' : 'Create Template'}
                  onPress={showEditModal ? handleEditTemplate : handleCreateTemplate}
                  loading={saving}
                  disabled={saving}
                />
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  disabled={saving}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== VARIABLES MODAL ==================== */}
      <Modal
        visible={showVariablesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVariablesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.variablesModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Variables</Text>
              <TouchableOpacity onPress={() => setShowVariablesModal(false)}>
                <Octicons name="x" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <Text style={styles.variablesDescription}>
              Tap any variable to copy or insert it into your message
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {AVAILABLE_VARIABLES.map((variable, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.variableItem}
                  onPress={() => {
                    if (showCreateModal || showEditModal) {
                      insertVariable(variable.key);
                    }
                    setShowVariablesModal(false);
                  }}
                >
                  <View style={styles.variableCode}>
                    <Text style={styles.variableKey}>{variable.key}</Text>
                  </View>
                  <Text style={styles.variableDescription}>{variable.description}</Text>
                  <Octicons name="chevron-right" size={16} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.type === 'danger' && selectedTemplate ? 'Delete' : 'OK'}
        cancelText={alertConfig.type === 'danger' && selectedTemplate ? 'Cancel' : null}
        onConfirm={() => {
          if (alertConfig.type === 'danger' && selectedTemplate) {
            handleDeleteTemplate(selectedTemplate.id);
            setSelectedTemplate(null);
          }
          setShowAlert(false);
        }}
        onCancel={() => {
          setSelectedTemplate(null);
          setShowAlert(false);
        }}
      />
    </View>
  );
}

/* ==================== TEMPLATE CARD COMPONENT ==================== */

const TemplateCard = ({ template, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.templateCard}>
      <TouchableOpacity
        style={styles.templateHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.templateHeaderLeft}>
          <View style={styles.templateIconContainer}>
            <Octicons name="note" size={20} color={COLORS.blue} />
          </View>
          <View style={styles.templateInfo}>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateCategory}>{template.category || 'General'}</Text>
          </View>
        </View>
        <Octicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.gray}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.templateBody}>
          <Text style={styles.templateMessage}>{template.message}</Text>

          <View style={styles.templateActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Octicons name="pencil" size={16} color={COLORS.blue} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Octicons name="trash" size={16} color={COLORS.danger} />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  variablesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
  },
  variablesButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  contentContainer: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  templateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 2,
  },
  templateCategory: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  templateBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
  },
  templateMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 12,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  actionButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deleteButtonText: {
    color: COLORS.danger,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  variablesModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  categoryText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insertVariableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insertVariableText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  textArea: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.gray,
    minHeight: 120,
  },
  characterCount: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  previewBox: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },
  previewText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    lineHeight: 20,
  },
  modalActions: {
    gap: 8,
  },
  variablesDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 16,
    lineHeight: 20,
  },
  variableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 8,
  },
  variableCode: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  variableKey: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  variableDescription: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.black,
  },
});