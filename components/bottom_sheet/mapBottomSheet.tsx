import { useState } from 'react'
import { Sheet, Button, YStack } from 'tamagui'

export default function MapBottomSheet() {
  const [open, setOpen] = useState(true)

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={setOpen}
      snapPoints={[80]}
      dismissOnOverlayPress
    >
      <Sheet.Overlay />
      <Sheet.Handle />

      <Sheet.Frame>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Button onPress={() => setOpen(false)}>
            Hello world
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}