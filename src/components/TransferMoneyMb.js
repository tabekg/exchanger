import React, {useContext, useEffect, useState} from 'react'
import {Button, Caption, TextInput} from 'react-native-paper'
import {StyleSheet, Text, View} from 'react-native'
import {API_URL, VERIFICATION_CODE_LENGTH} from '../settings/settings'
import {GlobalContext} from '../../App'
import axios from 'axios'

function TransferMoneyMb() {
  const {user, token, setUser} = useContext(GlobalContext)
  const [mbNumber, setMbNumber] = useState(0)
  const [mbSum, setMbsum] = useState(0)
  const [verification_code, setVerificationCode] = useState('');
  const [commission, setCommission] = useState('')

  const Send_money = () => {
    axios.post(API_URL + '/api/v1/transfer', {
      to: 'mbank',
      sum: mbSum,
      requisite: mbNumber
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },).then((response) => {
      console.log(response)
      alert(`Ваша завязка отправлена Ваш перевод ${mbSum}`)
      setUser(response.data.payload.user)
    }).catch((e) => {
      console.log(e)
      alert('Ошибка')
    })
    setMbNumber(0)
    setMbsum(0)
    setVerificationCode('')
  }

  useEffect(() => {
    well()
  }, [user])

  const well = () => {
    axios.get(API_URL + '/api/v1/exchange', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((data) => {
        setCommission(data.data.payload.commission)
        console.log(data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const con_text = mbNumber.length === 10 && mbSum.length  > 3 && mbSum.length < 7 && verification_code.length === VERIFICATION_CODE_LENGTH

  return (
    <View style={{backgroundColor: '#272B34', height: '100%'}}>
      <View style={styles.bigCorobca}>
        <Text style={{color: '#fff', textAlign: 'center'}}>Ваш баланс</Text>
        <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>{user.balance_kgs}
          <Text style={{color: '#fff', fontSize: 15}}>  KGS</Text></Text>
      </View>
      <View>
        <TextInput
          placeholderTextColor="grey"
          placeholder={`Введите лицевой счет`}
          keyboardType="numeric"
          style={styles.myInput}
          value={mbNumber}
          onChangeText={sum => setMbNumber(sum)}
        />
        <TextInput
          placeholderTextColor="grey"
          placeholder={`Сумма KGS`}
          keyboardType="numeric"
          style={styles.myInput}
          value={mbSum}
          onChangeText={sum => setMbsum(sum)}
        />
        <Text style={{color: '#cbc9c9', marginHorizontal: 15}}>Комиссия Tether: {commission} %</Text>
        <TextInput
          label="Код"
          value={verification_code}
          keyboardType="numeric"
          onChangeText={t => setVerificationCode(t)}
          style={styles.myInput}
        />
        <Button
          style={styles.myButton}
          mode="contained"
          disabled={!con_text}
          onPress={() => Send_money()}
        >
          Отправить заявку
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    marginHorizontal: 4,
    fontSize: 16,
  },
  myButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 5,
    backgroundColor: 'blue',
  },
  myInput: {
    backgroundColor: 'white',
    height: 50,
    width: '90%',
    marginHorizontal: 15,
    marginVertical: 15,
    lineHeight: 20,
    fontSize: 15
  },
  bigCorobca: {
    marginVertical: 20,
    alignItems: 'center',
    marginHorizontal: 30,
    borderRadius: 10,
  },
});

export default TransferMoneyMb
