// import mailjet from 'node-mailjet'

// const mailjetClient = mailjet?.connect(
//   '3611bae8feb2d7600e0823610119208d',
//   '60fd1c5805283d940d2be9c081862f5c',
// )

const emailsTo = [
  {
    Name: 'Oscar',
    Email: 'oscar.cardenasg@gmail.com',
  },
  // {
  //   Name: 'Fernando',
  //   Email: 'starla.frr@gmail.com',
  // },
  // {
  //   Name: 'Jonathan',
  //   Email: 'jan.merol@gmail.com',
  // },
]

const templateIds = {
  CONTRACT: 3745457,
  SHOPPING: 4120221,
}

export default async function emailNotifier(_, res) {
  if (!res.emailData) return false

  try {
    const { notifyType, email, name, subject, variables } = res.emailData
    const templateId = templateIds[notifyType]
    const sendData = {
      Messages: [
        {
          To: emailsTo,
          Subject: subject,
          Variables: variables,
          TemplateID: templateId,
          TemplateLanguage: true,
          From: { Email: email, Name: name },
        },
      ],
    }

    if (process.env.NODE_ENV === 'production') {
      // const request = mailjetClient
      //   .post('send', { version: 'v3.1' })
      //   .request(sendData)
      // request
      //   .then(result => console.log(JSON.stringify(result.body, null, 2)))
      //   .then(console.log)
    }

    console.log(JSON.stringify(sendData, null, 0))
  } catch (error) {
    console.log(error)
  }
}
