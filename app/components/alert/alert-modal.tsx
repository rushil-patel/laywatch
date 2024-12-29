import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Form } from '@remix-run/react'
import { BellIcon } from '@radix-ui/react-icons'

type AlertModalProps = {
  modalTitle: string
  buttonTitle: string
  message: string
  onClose: () => void
}

export const AlertModal: React.FC<AlertModalProps> = ({
  buttonTitle,
  modalTitle,
  message,
  onClose,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <BellIcon />
          &nbsp;&nbsp;{buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <Form method="post" autoComplete="off" className="w-full">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Company</Label>
              <Input name="company" type="text" />
              <Label>City</Label>
              <Input name="city" type="text"></Input>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
