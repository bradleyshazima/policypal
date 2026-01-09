import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';

// Mock templates data
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: '15-Day Reminder',
    message: 'Hi {client_name}, this is a reminder that your insurance policy for {car_model} expires on {renewal_date}. Please renew on time to avoid lapses.',
    category: 'Renewal',
    usageCount: 45,
    lastUsed: '2 days ago',
  },
  {
    id: '2',
    name: '7-Day Urgent Reminder',
    message: 'Dear {client_name}, your policy expires in 7 days on {renewal_date}. Contact us immediately to renew your {insurance_type} cover for {car_model}.',
    category: 'Renewal',
    usageCount: 32,
    lastUsed: '5 days ago',
  },
  {
    id: '3',
    name: 'Payment Confirmation',
    message: 'Thank you {client_name}! We have received your payment of {amount} for policy {policy_number}. Your cover is now active.',
    category: 'Confirmation',
    usageCount: 28,
    lastUsed: '1 day ago',
  },
  {
    id: '4',
    name: 'Welcome New Client',
    message: 'Welcome {client_name}! Thank you for choosing our agency. Your {insurance_type} policy for {car_model} is now active. Policy No: {policy_number}',
    category: 'Welcome',
    usageCount: 15,
    lastUsed: '3 days ago',
  },
  {
    id: '5',
    name: 'Expiry Day Alert',
    message: 'URGENT: {client_name}, your insurance expires TODAY! Renew now to maintain coverage for {car_model}. Call us: [Your Number]',
    category: 'Alert',
    usageCount: 8,
    lastUsed: '1 week ago',
  },
];

// Available variables
const AVAILABLE_VARIABLES = [
  { key: '{client_name}', description: "Client's full name" },
  { key: '{car_model}', description: 'Vehicle make and model' },
  { key: '{renewal_date}', description: 'Policy renewal/expiry date' },
  { key: '{insurance_type}', description: 'Type of insurance cover' },
  { key: '{policy_number}', description: 'Policy number' },
  { key: '{amount}', description: 'Payment or premium amount' },
  { key: '{plate_number}', description: 'Vehicle registration number' },
  { key: '{company_name}', description: 'Your agency name' },
];

export default function MessageTemplatesScreen() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Renewal');

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateMessage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      message: templateMessage,
      category: templateCategory,
      usageCount: 0,
      lastUsed: 'Never',
    };

    setTemplates([newTemplate, ...templates]);
    setShowCreateModal(false);
    resetForm();
    Alert.alert('Success', 'Template created successfully!');
  };

  const handleEditTemplate = () => {
    if (!templateName.trim() || !templateMessage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, name: templateName, message: templateMessage, category: templateCategory }
          : t
      )
    );

    setShowEditModal(false);
    setSelectedTemplate(null);
    resetForm();
    Alert.alert('Success', 'Template updated successfully!');
  };

  const handleDeleteTemplate = (id) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTemplates(templates.filter((t) => t.id !== id));
            Alert.alert('Success', 'Template deleted successfully!');
          },
        },
      ]
    );
  };

  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateMessage(template.message);
    setTemplateCategory(template.category);
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
              onDelete={() => handleDeleteTemplate(template.id)}
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
                />
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
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
            <Text style={styles.templateCategory}>{template.category}</Text>
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

          <View style={styles.templateStats}>
            <View style={styles.stat}>
              <Octicons name="paper-airplane" size={12} color={COLORS.gray} />
              <Text style={styles.statText}>Used {template.usageCount} times</Text>
            </View>
            <View style={styles.stat}>
              <Octicons name="clock" size={12} color={COLORS.gray} />
              <Text style={styles.statText}>Last used {template.lastUsed}</Text>
            </View>
          </View>

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

  /* Header */
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

  /* Content */
  contentContainer: {
    padding: 16,
  },

  /* Template Card */
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
  templateStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
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

  /* FAB */
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

  /* Empty State */
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

  /* Modal */
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

  /* Form */
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

  /* Preview */
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

  /* Modal Actions */
  modalActions: {
    gap: 8,
  },

  /* Variables Modal */
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