import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';
import type { RadioButtonProps } from 'react-native-radio-buttons-group';
// @ts-ignore
import type {} from 'expo-document-picker';
import type {} from '@react-native-picker/picker';
import type {} from 'react-native-radio-buttons-group';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

type FileAsset = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

export default function TrackerForm() {
  const [form, setForm] = useState({
    email: '',
    yearGraduated: '',
    courseGraduated: '',
    contact: '',
    fbLink: '',
    program: '',
    lastName: '',
    firstName: '',
    middleName: '',
    gender: 'Male',
    age: '',
    birthdate: '',
    contactno: '',
    socmedlink:'',
    currentAdd: '',
    homeAdd: '',
    employeer1: '',
    empstat1:'',
    jobPos1:'',
    compAdd1:'',
    sector: '',
    presentlyEmployed: '',
    currentStat: '',
    currentComp: '',
    dateHired1: '',
    currentPos: '',
    employmentStatus: '',
    yearsEmployed: '',
    salaryRange: '',
    currentEmploy:'',
    fsDateStart: '',
    postGrad: '',
    postGradUniv:'',
    totalUnits:'',
    file: null as FileAsset | null,
  });

  const navigation = useNavigation();
  
  const [genderOptions, setGenderOptions] = useState<RadioButtonProps[]>([
    { id: '1', label: 'Male', value: 'Male', selected: true },
    { id: '2', label: 'Female', value: 'Female' },
  ]);

  const [sectorOptions, setSectorOptions] = useState<RadioButtonProps[]>([
    { id: '1', label: 'Private', value: 'Private', selected: true },
    { id: '2', label: 'Government', value: 'Government' },
  ]);

  const [presentlyEmployedOptions, setPresentlyEmployedOptions] = useState<RadioButtonProps[]>([
    { id: '1', label: 'Yes', value: 'Yes' },
    { id: '2', label: 'No', value: 'No', selected: true },  
  ]);

  const [employmentTypes, setEmploymentTypes] = useState({
    company: false,
    selfEmployed: false,
    freelance: false,
  });

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitted data:', form);
    Alert.alert('Submitted!', 'Your response has been recorded.');
  };

  const [hasAwards, setHasAwards] = useState('No');
  const [awardOptions, setAwardOptions] = useState([
    { id: '1', label: 'Yes', value: 'Yes' },
    { id: '2', label: 'No', value: 'No', selected: true },
  ]);

  const [furtherStudy, setFurtherStudy] = useState('No');
  const [furtherStudyOptions, setFurtherStudyOptions] = useState([
    { id: '1', label: 'Yes', value: 'Yes' },
    { id: '2', label: 'No', value: 'No', selected: true },
  ]);

  const [unemploymentReasons, setUnemploymentReasons] = useState({
    family: false,
    health: false,
    experience: false,
    noOpportunity: false,
    notLooking: false,
    seeking: false,
    study: false,
    other: false,
    otherText: '',
  });

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      handleChange('file', {
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
        size: file.size,
      });
    }
    
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1C4E80' }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#174f84" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>GRADUATE TRACER SURVEY – CTU MAIN</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>To our Dear Graduates,</Text>
        <Text style={styles.sectionDescription}>Kindly complete this questionnaire accurately and truthfully. Your responses will be used for research purposes to assess employability and, ultimately, improve the curriculum programs offered at Cebu Technological University (CTU). Rest assured that your answers to this survey will be treated with the utmost confidentiality.</Text>
        <Text style={styles.sectionDescription}>Thank you very much!</Text>
        <Text style={styles.sectionDescription}>If you have any questions, you may contact the office of the Alumni Director through 
        email address gts@ctu.edu.ph or Contact no: (032) 402 4060.</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.sectionDescription}>* Required</Text>

        <Text style={styles.label}>1. Email </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
        />

        <Text style={styles.label}>2. Year Graduated</Text>
        <TextInput
          style={styles.input}
          placeholder="Year"
          keyboardType="numeric"
          value={form.yearGraduated}
          onChangeText={(v) => handleChange('yearGraduated', v)}
        />

        <Text style={styles.label}>3. Course Graduated </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.courseGraduated}
            onValueChange={(itemValue: any) => handleChange('courseGraduated', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select your course" value="" enabled={false} />
            <Picker.Item label="Bachelor in Science in Information Technology" value="bsit" />
            <Picker.Item label="Bachelor in Science in Information System" value="bsis" />
            <Picker.Item label="Bachelor in Industrial Technology major in Computer Technology" value="bitct" />
          </Picker>
        </View>
      </View>

      {/* PART I - Personal Profile */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>PART I - Personal Profile</Text>
        <Text style={styles.sectionDescription}>N/A if not applicable</Text>

        <Text style={styles.label}>4. Last Name </Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={form.lastName}
          onChangeText={(v) => handleChange('lastName', v)}
        />       

        <Text style={styles.label}>5. First Name </Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={form.firstName}
          onChangeText={(v) => handleChange('firstName', v)}
        /> 

        <Text style={styles.label}>6. Middle Name </Text>
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={form.middleName}
          onChangeText={(v) => handleChange('middleName', v)}
        /> 
        <Text style={styles.label}>7. Gender</Text>
        <RadioGroup
          radioButtons={genderOptions}
          selectedId={genderOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = genderOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setGenderOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) handleChange('gender', selected.value);
          }}
          layout="row"
        />

        <Text style={styles.label}>8. Age </Text>
        <TextInput
          style={styles.input}
          placeholder="22"
          value={form.age}
          onChangeText={(v) => handleChange('age', v)}
        />

        <Text style={styles.label}>9. Birthdate</Text>
        <TextInput
          style={styles.input}
          placeholder="00/00/0000"
          value={form.birthdate}
          onChangeText={(v) => handleChange('birthdate', v)}
        />

        <Text style={styles.label}>10. Landline or Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+63"
          value={form.contactno}
          onChangeText={(v) => handleChange('contactno', v)}
        />     

        <Text style={styles.label}>11. Social Media Account Link (e.g  https://www.facebook.com/aboloc)  </Text>
        <TextInput
          style={styles.input}
          placeholder="https://www.facebook.com/aboloc"
          value={form.socmedlink}
          onChangeText={(v) => handleChange('socmedlink', v)}
        />  

        <Text style={styles.label}>12. Complete Current Address </Text>
        <TextInput
          style={styles.input}
          placeholder="Address 1"
          value={form.currentAdd}
          onChangeText={(v) => handleChange('currentAdd', v)}
        />  

        <Text style={styles.label}>13. Complete Home Address </Text>
        <TextInput
          style={styles.input}
          placeholder="Address 1"
          value={form.homeAdd}
          onChangeText={(v) => handleChange('homeAdd', v)}
        />         
      </View>


      {/* PART II - Employment Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>PART II - Employment Status</Text>
        <Text style={styles.sectionDescription}>N/A if not applicable</Text>

        <Text style={styles.label}>14. Name of your organization/employer <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Employeer 1"
          value={form.employeer1}
          onChangeText={(v) => handleChange('employeer1', v)}
        />

        <Text style={styles.label}>15. Date hired <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="00/00/0000"
          value={form.dateHired1}
          onChangeText={(v) => handleChange('dateHired1', v)}
        />    

        <Text style={styles.label}>16. Position <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <Text style={styles.sectionDescription}><Text style={{ fontStyle: 'italic' }}>(N/A if not applicable)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Manager"
          value={form.jobPos1}
          onChangeText={(v) => handleChange('jobPos1', v)}
        />  

        <Text style={styles.label}>17. Status of your employment <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <View style={styles.pickerWrapper}>
        <Picker
            selectedValue={form.employmentStatus}
            onValueChange={(itemValue: any) => handleChange('empstat1', itemValue)}
            style={styles.picker}
        >
            <Picker.Item label="Select Employment Status" value="" enabled={false} />
            <Picker.Item label="Permanent" value="permanent" />
            <Picker.Item label="Temporary" value="temporary" />
        </Picker>
        </View>

        <Text style={styles.label}>18. Company Address <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Company 1"
          value={form.compAdd1}
          onChangeText={(v) => handleChange('compAdd1', v)}
        /> 

        <Text style={styles.label}>
          19. Sector <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text>
        </Text>
        <RadioGroup
          radioButtons={sectorOptions}
          selectedId={sectorOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = sectorOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setSectorOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) handleChange('sector', selected.value);
          }}
          layout="row"
        />

        <Text style={styles.label}>20. First Employment Supporting Document </Text>
        <Text style={styles.labelDesc}>Please upload the soft copy of your Company ID (Back to back) 
        and either your employment Contract or Certificate of Employment using the provided link below.</Text>
        <Text style={styles.labelDesc}>If you are Self-employed. Please provide barangay permit or DTI registration or mayor’s permit </Text>
        <Text style={styles.labelDesc}>Here is the link:
        https://bit.ly/FirstEmploymentData</Text>
        <Text style={styles.labelDesc1}>Note: You will be required to sign in to Google when uploading your files.</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={styles.uploadButtonText}>Choose File</Text>
        </TouchableOpacity>
        {form.file && <Text style={styles.fileText}>{form.file.name}</Text>}

        <Text style={styles.label}>
          21. Are you <Text style={{ fontWeight: 'bold' }}>PRESENTLY</Text> employed?
        </Text>
        <RadioGroup
          radioButtons={presentlyEmployedOptions}
          selectedId={presentlyEmployedOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = presentlyEmployedOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setPresentlyEmployedOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) handleChange('presentlyEmployed', selected.value);
          }}
          layout="row"
        />

        </View>

      {/* PART III - Employment Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>PART III - Employment Status</Text>
        <Text style={styles.label}>
        22. Are you employed by a company/organization or are you self-employed?
        </Text>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setEmploymentTypes((prev) => ({ ...prev, company: !prev.company }))
            }
        >
            <View style={[styles.checkboxBox, employmentTypes.company && styles.checked]} />
            <Text style={styles.checkboxLabel}>Employed by a company/organization</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setEmploymentTypes((prev) => ({ ...prev, selfEmployed: !prev.selfEmployed }))
            }
        >
            <View style={[styles.checkboxBox, employmentTypes.selfEmployed && styles.checked]} />
            <Text style={styles.checkboxLabel}>Self-employed</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setEmploymentTypes((prev) => ({ ...prev, freelance: !prev.freelance }))
            }
        >
            <View style={[styles.checkboxBox, employmentTypes.freelance && styles.checked]} />
            <Text style={styles.checkboxLabel}>Freelance/Contract-based</Text>
        </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>23. Status of your CURRENT Employment</Text>
        <View style={styles.pickerWrapper}>
        <Picker
            selectedValue={form.employmentStatus}
            onValueChange={(itemValue: any) => handleChange('currentStat', itemValue)}
            style={styles.picker}
        >
            <Picker.Item label="Select Employment Status" value="" enabled={false} />
            <Picker.Item label="Permanent" value="permanent" />
            <Picker.Item label="Temporary" value="temporary" />
        </Picker>
        </View>

        <Text style={styles.label}>24. Name of your CURRENT organization/employer. <Text style={{ fontStyle: 'italic' }}>(Please don't abbreviate)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Company 1"
          value={form.currentComp}
          onChangeText={(v) => handleChange('currentComp', v)}
        />

        <Text style={styles.label}>25. Position <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text></Text>
        <Text style={styles.sectionDescription}><Text style={{ fontStyle: 'italic' }}>(N/A if not applicable)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Manager"
          value={form.currentPos}
          onChangeText={(v) => handleChange('currentPos', v)}
        />  

        <Text style={styles.label}>
          26. Sector <Text style={{ fontStyle: 'italic' }}>(1st employer right after graduation)</Text>
        </Text>
        <RadioGroup
          radioButtons={sectorOptions}
          selectedId={sectorOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = sectorOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setSectorOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) handleChange('sector', selected.value);
          }}
          layout="row"
        />


        <Text style={styles.label}>
        27. How long have you been employed? <Text style={{ fontStyle: 'italic' }}>(Current Employment)</Text></Text>
        <View style={styles.pickerWrapper}>
        <Picker
            selectedValue={form.yearsEmployed}
            onValueChange={(itemValue: any) => setForm((prev) => ({ ...prev, yearsEmployed: itemValue }))}
            style={styles.picker}
        >
            <Picker.Item label="Select duration" value="" enabled={false}/>
            <Picker.Item label="Less than 1 year" value="less_than_1" />
            <Picker.Item label="More than one (1) year" value="more_than_1" />
        </Picker>
        </View>

        <Text style={styles.label}>
        28. What is your current salary range? <Text style={{ fontStyle: 'italic' }}>(Current Employment)</Text></Text>
        <View style={styles.pickerWrapper}>
        <Picker
            selectedValue={form.salaryRange}
            onValueChange={(itemValue: any) => setForm((prev) => ({ ...prev, salaryRange: itemValue }))}
            style={styles.picker}
        >
            <Picker.Item label="Select salary range" value="" enabled={false} />
            <Picker.Item label="Below 10,000 Php" value="below_10k" />
            <Picker.Item label="10,001 Php – 20,000 Php" value="10k_20k" />
            <Picker.Item label="20,001 Php – 30,000 Php" value="20k_30k" />
            <Picker.Item label="Above 30,000 Php" value="above_30k" />
        </Picker>
        </View>
        
        <Text style={styles.label}>29. CURRENT Employment Supporting Document </Text>
        <Text style={styles.labelDesc}>Please upload the soft copy of your Company ID (Back to back) 
        and either your employment Contract or Certificate of Employment using the provided link below.</Text>
        <Text style={styles.labelDesc}>If you are Self-employed. Please provide barangay permit or DTI registration or mayor’s permit </Text>
        <Text style={styles.labelDesc}>Here is the link:
        https://bit.ly/FirstEmploymentData</Text>
        <Text style={styles.labelDesc1}>Note: You will be required to sign in to Google when uploading your files.</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={styles.uploadButtonText}>Choose File</Text>
        </TouchableOpacity>
        {form.file && <Text style={styles.fileText}>{form.file.name}</Text>}

        <Text style={styles.label}>
          30. Have you received any awards or recognition during your employment?
        </Text>
        <RadioGroup
          radioButtons={awardOptions}
          selectedId={awardOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = awardOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setAwardOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) setHasAwards(selected.value);
          }}
          layout="row"
        />


        <Text style={styles.label}>
        31. Supporting document for awards/recognition</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={styles.uploadButtonText}>Choose File</Text>
        </TouchableOpacity>
        {form.file && <Text style={styles.fileText}>{form.file.name}</Text>}

        <Text style={styles.label}>
          32. Did you pursue further study?
        </Text>
        <RadioGroup
          radioButtons={furtherStudyOptions}
          selectedId={furtherStudyOptions.find((btn) => btn.selected)?.id}
          onPress={(selectedId: any) => {
            const updatedButtons = furtherStudyOptions.map((btn) => ({
              ...btn,
              selected: btn.id === selectedId,
            }));
            setFurtherStudyOptions(updatedButtons);

            const selected = updatedButtons.find((btn) => btn.id === selectedId);
            if (selected) setFurtherStudy(selected.value);
          }}
          layout="row"
        />

      </View>

      {/* IF UNEMPLOYED */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>IF UNEMPLOYED</Text>
        <Text style={styles.label}>
        33. Reason for unemployment</Text>
        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, family: !prev.family }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.family && styles.checked]} />
            <Text style={styles.checkboxLabel}>Family concerns and the decision not to find a job</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, health: !prev.health }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.health && styles.checked]} />
            <Text style={styles.checkboxLabel}>Health-related reasons</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, experience: !prev.experience }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.experience && styles.checked]} />
            <Text style={styles.checkboxLabel}>Lack of work experience</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, noOpportunity: !prev.noOpportunity }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.noOpportunity && styles.checked]} />
            <Text style={styles.checkboxLabel}>No job opportunity</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, notLooking: !prev.notLooking }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.notLooking && styles.checked]} />
            <Text style={styles.checkboxLabel}>Did not look for a job</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, seeking: !prev.seeking }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.seeking && styles.checked]} />
            <Text style={styles.checkboxLabel}>Seeking employment</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, study: !prev.study }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.study && styles.checked]} />
            <Text style={styles.checkboxLabel}>For further study</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.checkboxItem}>
        <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
            setUnemploymentReasons((prev) => ({ ...prev, other: !prev.other }))
            }
        >
            <View style={[styles.checkboxBox, unemploymentReasons.other && styles.checked]} />
            <Text style={styles.checkboxLabel}>Other</Text>
        </TouchableOpacity>
        </View>

        {unemploymentReasons.other && (
        <TextInput
            style={styles.input}
            placeholder="Other"
            value={unemploymentReasons.otherText}
            onChangeText={(text) =>
            setUnemploymentReasons((prev) => ({ ...prev, otherText: text }))
            }
        />
        )}
      </View>

    {/* PART IV - Further Study */}
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>PART IV - Further Study</Text>
        <Text style={styles.sectionDescription}>N/A if not applicable</Text> 

        <Text style={styles.label}>34. Date Started</Text>
        <TextInput
          style={styles.input}
          placeholder="00/00/0000"
          value={form.fsDateStart}
          onChangeText={(v) => handleChange('fsDateStart', v)}
        />  

        <Text style={styles.label}>35. Please specify post graduate/degree</Text>
        <TextInput
          style={styles.input}
          placeholder="Graduate Program"
          value={form.postGrad}
          onChangeText={(v) => handleChange('postGrad', v)}
        />

        <Text style={styles.label}>36. Name of Institution/University</Text>
        <TextInput
          style={styles.input}
          placeholder="University"
          value={form.postGradUniv}
          onChangeText={(v) => handleChange('postGradUniv', v)}
        />

        <Text style={styles.label}>37. Total number of units obtain</Text>
        <TextInput
          style={styles.input}
          placeholder="Units"
          value={form.totalUnits}
          onChangeText={(v) => handleChange('totalUnits', v)}
        />
    </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1C4E80',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#003366',
  },
  introText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'justify',
    color: '#003366',
    
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#005c99',
  },
  sectionDescription: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 5,
    color: '#005c99',
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
    color: '#005c99',
  },
  labelDesc: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    color: '#005c99',
  },
  labelDesc1: {
    marginTop: 25,
    marginBottom: 4,
    fontSize: 10,
    color: '#005c99',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  card: {
    backgroundColor: '#A5D8DD',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  buttonText: {
    color: '#005c99',
    fontWeight: 'bold',
  },
  fileText: {
    marginTop: 8,
    color: '#333',
  },
  checkboxItem: {
  marginVertical: 4,
},

checkbox: {
  flexDirection: 'row',
  alignItems: 'center',
},

checkboxBox: {
  width: 20,
  height: 20,
  borderWidth: 2,
  borderColor: '#005c99',
  marginRight: 8,
  borderRadius: 4,
},

checked: {
  backgroundColor: '#005c99',
},

checkboxLabel: {
  fontSize: 14,
  color: '#005c99',
},
uploadButton: {
  backgroundColor: '#ffff',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},

uploadButtonText: {
  color: '#005c99',
  fontWeight: 'bold',
  fontSize: 16,
},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
    borderRadius: 20,
  },
  topBarTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#174f84',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
    marginRight: 30, // to balance the back arrow
  },

});
